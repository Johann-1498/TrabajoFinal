#!"C:\xampp\perl\bin\perl.exe"
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use JSON;
use DBI;

my $cgi = CGI->new;

my $token_sesion = $cgi->param('token');

if ($token_sesion) {
    # Aquí podrías realizar acciones adicionales, como cargar datos del usuario, etc.
    my $datos_usuario = cargar_datos_de_tabla($token_sesion);

    if ($datos_usuario) {
        # Devuelve los datos del usuario como respuesta JSON
        print $cgi->header(-type => 'application/json', -status => '200 OK');
        print to_json($datos_usuario);
    } else {
        # Si no se pudieron cargar los datos, devuelves un código de estado diferente o un mensaje de error
        print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
        print "Error al cargar datos del usuario";
    }
} else {
    # Si el token no es válido, puedes devolver un código de estado diferente o un mensaje de error
    print $cgi->header(-type => 'text/plain', -status => '401 Unauthorized');
    print "Token de sesión no válido";
}



sub to_json {
    my ($data) = @_;
    return JSON::encode_json($data);
}
sub cargar_datos_de_tabla {
    my ($token) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "", { RaiseError => 1 });
    my $query = "SELECT name, email FROM users WHERE token_sesion = ?";
    my $sth = $dbh->prepare($query);
    $sth->execute($token);

    my $datos_usuario = $sth->fetchrow_hashref;

    $sth->finish;
    $dbh->disconnect;

    return $datos_usuario;
}