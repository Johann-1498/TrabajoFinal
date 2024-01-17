#!"C:\xampp\perl\bin\perl.exe"
use strict;
use warnings;
use CGI;
use JSON;
my $cgi = CGI->new;
print $cgi->header('application/json');

if ($cgi->request_method() eq 'GET') {
    my $data = { mensaje => 'Hola desde el backend' };
    print to_json($data);
}
else {
    print to_json({ error => 'Método no permitido' });
}